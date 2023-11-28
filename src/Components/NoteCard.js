import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Input,
  Box,
  Text,
  useColorMode,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiTrash2 } from 'react-icons/fi';

const NoteCard = ({ note, googleId, onTagClick }) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedTags, setEditedTags] = useState([...note.tags]);
  const [isEditing, setIsEditing] = useState(false);

  const handleTagClick = (tag) => {
    onTagClick(tag);
  };


  const bgColor = colorMode === 'dark' ? 'gray.800' : 'yellow.200';
  const textColor = colorMode === 'dark' ? 'white' : 'black';
  const borderColor = colorMode === 'dark' ? 'white' : 'black';
  const noteId = note.id;

  useEffect(() => {
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setEditedTags([...note.tags]);
  }, [note]);

  const handleEditClick = () => {
    setIsEditing(true);
    onOpen();
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/notes/${googleId}/${noteId}`, {
        title: editedTitle,
        content: editedContent,
        tags: editedTags,
      });


      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/notes/${googleId}/${noteId}`);
      window.location.reload();
      onClose();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleTagInputChange = (event) => {
    setEditedTags(event.target.value.split(',').map((tag) => tag.trim()));
  };

  const handleAddTag = () => {
    setEditedTags((prevTags) => [...prevTags, '']);
  };

  const handleRemoveTag = (index) => {
    setEditedTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };


  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="md"
      mb={4}
      minW={{ base: '30%', md: '15rem' }} 
      minH={{ base: '1px', md: '15rem' }}
      maxW="100%"
      maxHeight="18rem"
      color={textColor}
      borderColor={borderColor}
      borderWidth="1px"
      position="relative"
      cursor="pointer"
      onClick={onOpen}
      flexDirection={{ base: 'row', md: 'column' }}
    >
      <Text fontSize="xl" fontWeight="bold" mb={2} textAlign="start">
        {editedTitle}
      </Text>
      <Text fontSize="md" textAlign="start">
        {editedContent}
      </Text>
      <Flex justify="flex-start" align="center" mt={2} flexWrap="wrap">
        {editedTags.map((tag, index) => (
          <Tag
            key={index}
            mr={1}
            mb={1}
            bgColor={colorMode === 'dark' ? 'gray.600' : 'yellow.100'}
            color={colorMode === 'dark' ? 'white' : 'black'}
            borderRadius="full"
            onClick={() => handleTagClick(tag)}
            cursor="pointer"
          >
            <TagLabel>{tag}</TagLabel>
            {isEditing && (
              <TagCloseButton onClick={() => handleRemoveTag(index)} />
            )}
          </Tag>
        ))}
        {isEditing && (
          <IconButton
            icon={<FiEdit />}
            aria-label="Add Tag"
            colorScheme="teal"
            size="sm"
            onClick={handleAddTag}
          />
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editedTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEditing ? (
              <>
                <Input
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    backgroundColor: bgColor,
                  }}
                  mb={2}
                />
                <Flex mt={2}>
                  <Input
                    placeholder="Tags (comma-separated)"
                    value={editedTags.join(', ')}
                    onChange={handleTagInputChange}
                  />
                  <IconButton
                    icon={<FiEdit />}
                    aria-label="Add Tag"
                    colorScheme="teal"
                    size="sm"
                    onClick={handleAddTag}
                  />
                </Flex>
              </>
            ) : (
              <>
                <Text>{editedContent}</Text>
                <Flex mt={2} justify="flex-start" flexWrap="wrap">
                  {editedTags.map((tag, index) => (
                    <Tag
                      key={index}
                      mr={1}
                      mb={1}
                      bgColor={colorMode === 'dark' ? 'gray.600' : 'yellow.100'}
                      color={colorMode === 'dark' ? 'white' : 'black'}
                      borderRadius="full"
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                </Flex>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <IconButton
              icon={<FiTrash2 />}
              aria-label="Delete"
              colorScheme="red"
              onClick={handleDelete}
              mr={3}
            />
            {isEditing ? (
              <IconButton
                icon={<FiSave />}
                aria-label="Save"
                colorScheme="teal"
                onClick={handleSave}
              />
            ) : (
              <IconButton
                icon={<FiEdit />}
                aria-label="Edit"
                colorScheme="teal"
                onClick={handleEditClick}
              />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NoteCard;
